using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BillSplitter.Models
{
    public class BillSplitterContext : DbContext
    {
        public DbSet<Person> Persons { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<BillCollection> BillCollections { get; set; }
        public DbSet<Split> Splits { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        public BillSplitterContext(DbContextOptions<BillSplitterContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /*
            modelBuilder.Entity<Bill>(builder =>
            {
                builder.HasKey(b => new { b.BillId, b.BillCollectionId });
                builder.Property(f => f.BillId).ValueGeneratedOnAdd();
            });
            */
            modelBuilder.Entity<Bill>(builder => builder.HasIndex(b => new { b.BillId, b.BillCollectionId }).IsUnique());
            modelBuilder.Entity<Split>(builder => builder.HasKey(s => new { s.BillId, s.BillCollectionId, s.PersonId }));


            base.OnModelCreating(modelBuilder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            try
            {
                return await base.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }

    public class Person
    {
        public int PersonId { get; set; }
        public string Name { get; set; }

        public List<Split> Splits { get; set; }
    }

    public class BillCollection
    {
        public int BillCollectionId { get; set; }
        public DateTime Date { get; set; }

        public List<Bill> Bills { get; set; }
    }

    public class Bill
    {
        public int BillId { get; set; }

        public int BillCollectionId { get; set; }

        public double TotalAmount { get; set; }

        public int SupplierId { get; set; }

        public int PersonId { get; set; }

        public List<Split> Splits { get; set; }
    }

    public class Split
    {
        public int BillId { get; set; }
        public int BillCollectionId { get; set; }
        public int PersonId { get; set; }
        public double? SplitPercent { get; set; }
        public double? SplitAmount { get; set; }
    }

    public class Supplier
    {
        public int SupplierId { get; set; }
        public string Name { get; set; }

        public List<Bill> Bills { get; set; }

    }
}
