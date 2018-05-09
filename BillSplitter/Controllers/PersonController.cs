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
    public class PersonController : Controller
    {
        private readonly BillService _billService;

        public PersonController()
        {
            this._billService = new BillService(() => new BillSplitterContext());
        }

        [HttpGet("")]
        public Task<IEnumerable<Person>> GetAllAsync()
        {
            return this._billService.GetPersonsAsync();
        }

        [HttpGet("{id}")]
        public Task<Person> GetSingleAsync(int id)
        {
            return this._billService.GetPersonAsync(id);
        }

        [HttpPost("")]
        public async Task<ActionResult> SaveAsync([FromBody] Person person)
        {
            var result = await this._billService.AddPersonAsync(person);
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
        public async Task<ActionResult> SaveAsync(int id, [FromBody] Person person)
        {
            if (id == person.PersonId)
            {
                var result = await this._billService.UpdatePersonAsync(person);
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
