using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BillSplitter.Models;

namespace BillSplitter.Services
{
    public interface IBillService
    {
        Task<int> AddBillAsync(Bill bill);
        Task<int> AddBillCollectionAsync(BillCollection billCollection);
        Task<int> AddPersonAsync(Person person);
        Task<int> AddSupplierAsync(Supplier supplier);
        Task<IEnumerable<BillCollection>> GetBillCollectionsAsync(Func<IQueryable<BillCollection>, IQueryable<BillCollection>> query = null);
        Task<Person> GetPersonAsync(int id);
        Task<IEnumerable<Person>> GetPersonsAsync();
        Task<Supplier> GetSupplierAsync(int id);
        Task<IEnumerable<Supplier>> GetSuppliersAsync();
        Task<int> UpdateBillCollectionAsync(BillCollection billCollection);
        Task<int> UpdatePersonAsync(Person person);
        Task<int> UpdateSupplierAsync(Supplier supplier);
        Task<BillCollection> GetBillCollectionAsync(int id);
        Task<Payment> GetPaymentAsync(int id);
        Task<IEnumerable<Payment>> GetPaymentsAsync(Func<IQueryable<Payment>, IQueryable<Payment>> query = null);
        Task<int> UpdatePaymentAsync(Payment payment);
        Task<int> AddPaymentAsync(Payment payment);
    }
}