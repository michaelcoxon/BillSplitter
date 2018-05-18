using EnsureFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BillSplitter
{
    /// <summary>
    /// Extensions to extend the extendableness of collections. extend.
    /// </summary>
    public static class CollectionExtensions
    {
        /// <summary>
        /// Adds and Deletes items from the <paramref name="destinationCollection"/> by using the <paramref name="sourceCollection"/> as the what the collection should like like now.
        /// </summary>
        /// <typeparam name="TDestination">The type of the destination.</typeparam>
        /// <typeparam name="TSource">The type of the source.</typeparam>
        /// <typeparam name="TKey">The type of the key used to match items in the <paramref name="sourceCollection"/> and <paramref name="destinationCollection"/>.</typeparam>
        /// <param name="destinationCollection">The destination collection.</param>
        /// <param name="sourceCollection">The source collection.</param>
        /// <param name="destinationKeySelector">The selector to match the key on the <paramref name="destinationCollection"/>. Must return type of <typeparamref name="TKey"/></param>
        /// <param name="sourceKeySelector">The selector to match the key on the <paramref name="sourceCollection"/>. Must return type of <typeparamref name="TKey"/></param>
        /// <param name="newItemActivator">The new item activator. Called when the item does not exist in the <typeparamref name="TDestination"/></param>
        public static ICollection<TDestination> Update<TDestination, TSource, TKey>(
            this ICollection<TDestination> destinationCollection,
            IEnumerable<TSource> sourceCollection,
            Func<TDestination, TKey> destinationKeySelector,
            Func<TSource, TKey> sourceKeySelector,
            Func<TSource, TKey, TDestination> newItemActivator)
            where TDestination : class
            where TSource : class
        {
            Ensure.Arg(destinationCollection, nameof(destinationCollection)).IsNotNull();
            Ensure.Arg(destinationKeySelector, nameof(destinationKeySelector)).IsNotNull();
            Ensure.Arg(sourceCollection, nameof(sourceCollection)).IsNotNull();
            Ensure.Arg(sourceKeySelector, nameof(sourceKeySelector)).IsNotNull();
            Ensure.Arg(newItemActivator, nameof(newItemActivator)).IsNotNull();

            return destinationCollection.Update(sourceCollection, destinationKeySelector, sourceKeySelector, newItemActivator, null);
        }

        /// <summary>
        /// Adds, Deletes and Updates items from the <paramref name="destinationCollection"/> by using the <paramref name="sourceCollection"/> as the what the collection should like like now.
        /// </summary>
        /// <typeparam name="TDestination">The type of the destination.</typeparam>
        /// <typeparam name="TSource">The type of the source.</typeparam>
        /// <typeparam name="TKey">The type of the key used to match items in the <paramref name="sourceCollection"/> and <paramref name="destinationCollection"/>.</typeparam>
        /// <param name="destinationCollection">The destination collection.</param>
        /// <param name="sourceCollection">The source collection.</param>
        /// <param name="destinationKeySelector">The selector to match the key on the <paramref name="destinationCollection"/>. Must return type of <typeparamref name="TKey"/></param>
        /// <param name="sourceKeySelector">The selector to match the key on the <paramref name="sourceCollection"/>. Must return type of <typeparamref name="TKey"/></param>
        /// <param name="newItemActivator">The new item activator. Called when the item does not exist in the <typeparamref name="TDestination"/></param>
        /// <param name="updateItemActivator">The update item activator. Called when an update is required</param>
        public static ICollection<TDestination> Update<TDestination, TSource, TKey>(
            this ICollection<TDestination> destinationCollection,
            IEnumerable<TSource> sourceCollection,
            Func<TDestination, TKey> destinationKeySelector,
            Func<TSource, TKey> sourceKeySelector,
            Func<TSource, TKey, TDestination> newItemActivator,
            Action<TSource, TDestination> updateItemActivator)
            where TDestination : class
            where TSource : class
        {
            Ensure.Arg(destinationCollection, nameof(destinationCollection)).IsNotNull();
            Ensure.Arg(destinationKeySelector, nameof(destinationKeySelector)).IsNotNull();
            Ensure.Arg(sourceCollection, nameof(sourceCollection)).IsNotNull();
            Ensure.Arg(sourceKeySelector, nameof(sourceKeySelector)).IsNotNull();
            Ensure.Arg(newItemActivator, nameof(newItemActivator)).IsNotNull();

            var currentIds = destinationCollection.Select(destinationKeySelector).ToArray();
            var incomingIds = sourceCollection.Select(sourceKeySelector).ToArray();

            var deleteIds = currentIds.Where(id => !incomingIds.Contains(id)).ToArray();
            var newIds = incomingIds.Where(id => !currentIds.Any(cc => cc.Equals(id))).ToArray();

            // we support updates!
            if (updateItemActivator != null)
            {
                var updateIds = currentIds.Where(id => incomingIds.Contains(id));

                foreach (var id in updateIds)
                {
                    var itemToUpdate = destinationCollection.Single(i => destinationKeySelector(i).Equals(id));
                    var sourceItem = sourceCollection.Single(i => sourceKeySelector(i).Equals(id));
                    updateItemActivator(sourceItem, itemToUpdate);
                }
            }

            // deletes
            if (deleteIds.Any())
            {
                foreach (var id in deleteIds)
                {
                    var itemToDelete = destinationCollection.Single(i => destinationKeySelector(i).Equals(id));
                    destinationCollection.Remove(itemToDelete);
                }
            }

            // adds
            if (newIds.Any())
            {
                foreach (var id in newIds)
                {
                    var sourceItemToAdd = sourceCollection.Single(i => sourceKeySelector(i).Equals(id));
                    destinationCollection.Add(newItemActivator(sourceItemToAdd, id));
                }
            }

            return destinationCollection;
        }
    }
}
