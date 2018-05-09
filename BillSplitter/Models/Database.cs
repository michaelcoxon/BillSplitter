using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=billSplitter.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Split>()
                .HasKey(a => new { a.BillId, a.PersonId });

            base.OnModelCreating(modelBuilder);
        }
    }

    public class Person
    {
        public int PersonId { get; set; }
        public string Name { get; set; }
    }

    public class BillCollection
    {
        public int BillCollectionId { get; set; }
        public DateTimeOffset Date { get; set; }
        public List<Bill> Bills { get; set; }
    }

    public class Bill
    {
        public int BillId { get; set; }
        public double TotalAmount { get; set; }
        public Supplier Supplier { get; set; }
        public Person PaidBy { get; set; }
        public List<Split> SplitWith { get; set; }
    }

    public class Split
    {
        public int BillId { get; set; }
        public int PersonId { get; set; }
        public Bill Bill { get; set; }
        public Person Person { get; set; }
        public double? SplitPercent { get; set; }
        public double? SplitAmount { get; set; }
    }

    public class Supplier
    {
        public int SupplierId { get; set; }
        public string Name { get; set; }
    }
}
