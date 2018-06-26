using BillSplitter.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BillSplitter.Services
{
    public class BillService : IDisposable, IBillService
    {
        private readonly BillSplitterContext _billSplitterContext;

        public BillService(BillSplitterContext billSplitterContext)
        {
            this._billSplitterContext = billSplitterContext;
        }

        public async Task<int> AddBillAsync(Bill bill)
        {
            var context = this._billSplitterContext;
            await context.Bills.AddAsync(bill);
            return await context.SaveChangesAsync();
        }


        public async Task<int> AddBillCollectionAsync(BillCollection billCollection)
        {
            var context = this._billSplitterContext;


            var actualBillCollection = new BillCollection
            {
                Date = billCollection.Date.Date,
                Bills = new List<Bill>(billCollection.Bills.Select(bill => new Bill
                {
                    PersonId = bill.PersonId,
                    SupplierId = bill.SupplierId,
                    TotalAmount = bill.TotalAmount,
                    BillDate = bill.BillDate,
                    Comment = bill.Comment,

                    Splits = new List<Split>(bill.Splits.Select(split => new Split
                    {
                        PersonId = split.PersonId,
                        SplitAmount = split.SplitAmount,
                        SplitPercent = split.SplitPercent,
                    }))
                }))
            };

            await context.BillCollections.AddAsync(actualBillCollection);

            return await context.SaveChangesAsync();
        }

        public async Task<BillCollection> GetBillCollectionAsync(int id)
        {
            var context = this._billSplitterContext;
            return await context.BillCollections
                .Include(bc => bc.Bills).ThenInclude(b => b.Splits)
                .SingleOrDefaultAsync(bc => bc.BillCollectionId == id);
        }

        public async Task<IEnumerable<BillCollection>> GetBillCollectionsAsync(Func<IQueryable<BillCollection>, IQueryable<BillCollection>> query = null)
        {
            var context = this._billSplitterContext;
            return await query(context.BillCollections
                .Include(bc => bc.Bills).ThenInclude(b => b.Splits))
                .ToListAsync();
        }

        public async Task<int> UpdateBillCollectionAsync(BillCollection billCollection)
        {
            var context = this._billSplitterContext;

            var actualBillCollection = await this.GetBillCollectionAsync(billCollection.BillCollectionId);

            actualBillCollection.Date = billCollection.Date.Date;

            actualBillCollection.Bills.Update(
                billCollection.Bills,
                b => new { b.BillCollectionId, b.BillId },
                b => new { b.BillCollectionId, b.BillId },
                (b, k) => b,
                (src, dest) =>
                {
                    dest.PersonId = src.PersonId;
                    dest.SupplierId = src.SupplierId;
                    dest.TotalAmount = src.TotalAmount;
                    dest.BillDate = src.BillDate;
                    dest.Comment = src.Comment;

                    dest.Splits.Update(
                        src.Splits,
                        s => new { s.BillId, s.BillCollectionId, s.PersonId },
                        s => new { s.BillId, s.BillCollectionId, s.PersonId },
                        (s, k) => s,
                        (src1, dest1) =>
                        {
                            dest1.SplitAmount = src1.SplitAmount;
                            dest1.SplitPercent = src1.SplitPercent;
                        });
                });

            context.BillCollections.Update(actualBillCollection);
            return await context.SaveChangesAsync();
        }

        public async Task<int> AddSupplierAsync(Supplier supplier)
        {
            var context = this._billSplitterContext;
            await context.Suppliers.AddAsync(supplier);
            return await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Supplier>> GetSuppliersAsync()
        {
            var context = this._billSplitterContext;
            return await context.Suppliers.ToListAsync();
        }

        public async Task<int> UpdateSupplierAsync(Supplier supplier)
        {
            var context = this._billSplitterContext;
            context.Suppliers.Update(supplier);
            return await context.SaveChangesAsync();
        }

        public async Task<Supplier> GetSupplierAsync(int id)
        {
            var context = this._billSplitterContext;
            return await context.Suppliers.FindAsync(id);
        }

        public async Task<int> AddPersonAsync(Person person)
        {
            var context = this._billSplitterContext;
            await context.Persons.AddAsync(person);
            return await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Person>> GetPersonsAsync()
        {
            var context = this._billSplitterContext;
            return await context.Persons.ToListAsync();
        }

        public async Task<Person> GetPersonAsync(int id)
        {
            var context = this._billSplitterContext;
            return await context.Persons.FindAsync(id);
        }

        public async Task<int> UpdatePersonAsync(Person person)
        {
            var context = this._billSplitterContext;
            context.Persons.Update(person);
            return await context.SaveChangesAsync();
        }

        public async Task<Payment> GetPaymentAsync(int id)
        {
            var context = this._billSplitterContext;
            return await context.Payments.FindAsync(id);
        }

        public async Task<IEnumerable<Payment>> GetPaymentsAsync(Func<IQueryable<Payment>, IQueryable<Payment>> query = null)
        {
            var context = this._billSplitterContext;
            return await query(context.Payments).ToListAsync();
        }

        public async Task<int> UpdatePaymentAsync(Payment payment)
        {
            var context = this._billSplitterContext;
            context.Payments.Update(payment);
            return await context.SaveChangesAsync();
        }

        public async Task<int> AddPaymentAsync(Payment payment)
        {
            var context = this._billSplitterContext;
            await context.Payments.AddAsync(payment);
            return await context.SaveChangesAsync();
        }
        public void Dispose()
        {
            this._billSplitterContext.Dispose();
        }
    }
}
