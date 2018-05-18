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
    public class PaymentController : Controller
    {
        private readonly IBillService _billService;

        public PaymentController(IBillService billService)
        {
            this._billService = billService;
        }

        [HttpGet("")]
        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await this._billService.GetPaymentsAsync(c => c.OrderByDescending(p => p.Date));
        }

        [HttpGet("{id}")]
        public Task<Payment> GetSingleAsync(int id)
        {
            return this._billService.GetPaymentAsync(id);
        }

        [HttpPost("")]
        public async Task<ActionResult> SaveAsync([FromBody] Payment payment)
        {
            try
            {
                var result = await this._billService.AddPaymentAsync(payment);
                if (result > 0)
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
        public async Task<ActionResult> SaveAsync(int id, [FromBody] Payment payment)
        {
            try
            {

                if (id == payment.PaymentId)
                {
                    var result = await this._billService.UpdatePaymentAsync(payment);
                    if (result > 0)
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
