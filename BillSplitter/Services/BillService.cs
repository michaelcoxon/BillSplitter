using BillSplitter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BillSplitter.Services
{
    public class BillService
    {
        private readonly Func<BillSplitterContext> _billSplitterContextFactory;

        public BillService(Func<BillSplitterContext> billSplitterContextFactory)
        {
            this._billSplitterContextFactory = billSplitterContextFactory;
        }

        public async Task<int> AddBillAsync(Bill bill)
        {
            using (var context = this._billSplitterContextFactory())
            {
                await context.Bills.AddAsync(bill);
                return await context.SaveChangesAsync();
            }
        }


        public async Task<int> AddBillCollectionAsync(BillCollection billCollection)
        {
            using (var context = this._billSplitterContextFactory())
            {
                await context.BillCollections.AddAsync(billCollection);
                return await context.SaveChangesAsync();
            }
        }
        public async Task<BillCollection> GetBillCollectionAsync(int id)
        {
            using (var context = this._billSplitterContextFactory())
            {
                return await context.BillCollections.FindAsync(id);
            }
        }

        public Task<IEnumerable<BillCollection>> GetBillCollectionsAsync()
        {
            return Task.Run<IEnumerable<BillCollection>>(() =>
            {
                using (var context = this._billSplitterContextFactory())
                {
                    return context.BillCollections.ToList();
                }
            });
        }

        public async Task<int> UpdateBillCollectionAsync(BillCollection billCollection)
        {
            using (var context = this._billSplitterContextFactory())
            {
                context.BillCollections.Update(billCollection);
                return await context.SaveChangesAsync();
            }
        }

        public async Task<int> AddSupplierAsync(Supplier supplier)
        {
            using (var context = this._billSplitterContextFactory())
            {
                await context.Suppliers.AddAsync(supplier);
                return await context.SaveChangesAsync();
            }
        }

        public Task<IEnumerable<Supplier>> GetSuppliersAsync()
        {
            return Task.Run<IEnumerable<Supplier>>(() =>
            {
                using (var context = this._billSplitterContextFactory())
                {
                    return context.Suppliers.ToList();
                }
            });
        }

        public async Task<int> UpdateSupplierAsync(Supplier supplier)
        {
            using (var context = this._billSplitterContextFactory())
            {
                context.Suppliers.Update(supplier);
                return await context.SaveChangesAsync();
            }
        }

        public async Task<Supplier> GetSupplierAsync(int id)
        {
            using (var context = this._billSplitterContextFactory())
            {
                return await context.Suppliers.FindAsync(id);
            }
        }

        public async Task<int> AddPersonAsync(Person person)
        {
            using (var context = this._billSplitterContextFactory())
            {
                await context.Persons.AddAsync(person);
                return await context.SaveChangesAsync();
            }
        }

        public Task<IEnumerable<Person>> GetPersonsAsync()
        {
            return Task.Run<IEnumerable<Person>>(() =>
            {
                using (var context = this._billSplitterContextFactory())
                {
                    return context.Persons.ToList();
                }
            });
        }

        public async Task<Person> GetPersonAsync(int id)
        {
            using (var context = this._billSplitterContextFactory())
            {
                return await context.Persons.FindAsync(id);
            }
        }
        public async Task<int> UpdatePersonAsync(Person person)
        {
            using (var context = this._billSplitterContextFactory())
            {
                context.Persons.Update(person);
                return await context.SaveChangesAsync();
            }
        }
    }
}
