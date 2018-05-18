using BillSplitter.Models;
using BillSplitter.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BillSplitter.Controllers
{
    [Route("api/[controller]")]
    public class SupplierController : Controller
    {
        private readonly IBillService _billService;

        public SupplierController(IBillService billService)
        {
            this._billService = billService;
        }

        [HttpGet("")]
        public Task<IEnumerable<Supplier>> GetAllAsync()
        {
            return this._billService.GetSuppliersAsync();
        }

        [HttpGet("{id}")]
        public Task<Supplier> GetSingleAsync(int id)
        {
            return this._billService.GetSupplierAsync(id);
        }

        [HttpPost("")]
        public async Task<ActionResult> SaveAsync([FromBody] Supplier supplier)
        {
            var result = await this._billService.AddSupplierAsync(supplier);
            if (result == 1)
            {
                return this.Ok();
            }
            else
            {
                return this.BadRequest("No change was made");
            }
        }

        [HttpPost("{id}")]
        public async Task<ActionResult> SaveAsync(int id, [FromBody] Supplier supplier)
        {
            if (id == supplier.SupplierId)
            {
                var result = await this._billService.UpdateSupplierAsync(supplier);
                if (result == 1)
                {
                    return this.Ok();
                }
                else
                {
                    return this.BadRequest("No change was made");
                }
            }
            else
            {
                return this.BadRequest("Bad id");
            }
        }
    }
}
