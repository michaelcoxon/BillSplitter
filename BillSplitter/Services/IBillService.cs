using System.Collections.Generic;
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
        Task<IEnumerable<BillCollection>> GetBillCollectionsAsync();
        Task<Person> GetPersonAsync(int id);
        Task<IEnumerable<Person>> GetPersonsAsync();
        Task<Supplier> GetSupplierAsync(int id);
        Task<IEnumerable<Supplier>> GetSuppliersAsync();
        Task<int> UpdateBillCollectionAsync(BillCollection billCollection);
        Task<int> UpdatePersonAsync(Person person);
        Task<int> UpdateSupplierAsync(Supplier supplier);
        Task<BillCollection> GetBillCollectionAsync(int id);
    }
}