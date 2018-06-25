using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BillSplitter.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BillSplitter.Controllers
{
    [Route("api/[controller]")]
    public class SetupController : Controller
    {
        private readonly DbContext _dbContext;

        public SetupController(BillSplitterContext dbContext)
        {
            this._dbContext = dbContext;
        }

        [ResponseCache(Duration = 0, NoStore = true)]
        [HttpGet("run-migrations")]
        public async Task<IActionResult> RunMigrationsAsync()
        {
            var migrator = this._dbContext.GetService<IMigrator>();
            await migrator.MigrateAsync();
            return Ok();
        }
    }
}
