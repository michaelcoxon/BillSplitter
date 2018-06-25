using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BillSplitter.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BillSplitter.Controllers
{
    [Route("api/[controller]")]
    public class ExpenditureController : Controller
    {
        private readonly BillSplitterContext _dbContext;

        public ExpenditureController(BillSplitterContext dbContext)
        {
            this._dbContext = dbContext;
        }

        public override BadRequestResult BadRequest()
        {
            return base.BadRequest();
        }

        [HttpGet("")]
        public async Task<IEnumerable<Expenditure>> GetAllAsync()
        {
            return await this._dbContext.BillCollections
                .SelectMany(bc => bc.Bills)
                .GroupBy(b => new { b.SupplierId, b.PersonId })
                .Select(gb => new Expenditure
                {
                    PersonId = gb.Key.PersonId,
                    SupplierId = gb.Key.SupplierId,
                    AvgPerMonth = gb
                        .GroupBy(gbm => gbm.BillDate.Month)
                        .Average(gbm => gbm.Select(b => b.TotalAmount).Sum()),
                    AvgPerVisit = gb.Average(b => b.TotalAmount),
                    TotalSpend = gb
                        .Select(b => new { b.SupplierId, b.TotalAmount })
                        .GroupBy(sa => sa.SupplierId)
                        .Select(gsa => gsa.Sum(sa => sa.TotalAmount))
                        .Sum()
                })
                .ToListAsync();
        }
    }
}
