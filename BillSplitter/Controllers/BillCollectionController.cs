using BillSplitter.Models;
using BillSplitter.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BillSplitter.Controllers
{
    [Route("api/[controller]")]
    public class BillCollectionController : Controller
    {
        private readonly BillService _billService;

        public BillCollectionController()
        {
            this._billService = new BillService(() => new BillSplitterContext());
        }

        [HttpGet("")]
        public Task<IEnumerable<BillCollection>> GetAllAsync()
        {
            return this._billService.GetBillCollectionsAsync();
        }

        [HttpGet("{id}")]
        public Task<BillCollection> GetSingleAsync(int id)
        {
            return this._billService.GetBillCollectionAsync(id);
        }

        [HttpPost("")]
        public async Task<ActionResult> SaveAsync([FromBody] BillCollection billCollection)
        {
            var result = await this._billService.AddBillCollectionAsync(billCollection);
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
        public async Task<ActionResult> SaveAsync(int id, [FromBody] BillCollection billCollection)
        {
            if (id == billCollection.BillCollectionId)
            {
                var result = await this._billService.UpdateBillCollectionAsync(billCollection);
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
