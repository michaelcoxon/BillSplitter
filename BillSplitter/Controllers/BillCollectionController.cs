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
    public class BillCollectionController : Controller
    {
        private readonly IBillService _billService;

        public BillCollectionController(IBillService billService)
        {
            this._billService = billService;
        }

        public override BadRequestResult BadRequest()
        {
            return base.BadRequest();
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
            try
            {
                var result = await this._billService.AddBillCollectionAsync(billCollection);
                if (result > 1)
                {
                    return this.Ok();
                }
                else
                {
                    return this.BadRequest("No change was made");
                }
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}")]
        public async Task<ActionResult> SaveAsync(int id, [FromBody] BillCollection billCollection)
        {
            try
            {

                if (id == billCollection.BillCollectionId)
                {
                    var result = await this._billService.UpdateBillCollectionAsync(billCollection);
                    if (result > 1)
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
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }

        }
    }
}
