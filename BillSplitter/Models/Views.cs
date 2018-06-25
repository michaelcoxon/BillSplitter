using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillSplitter.Models
{
    public class Expenditure
    {
        public int SupplierId { get; set; }
        public int PersonId { get; set; }
        public double AvgPerVisit { get; set; }
        public double AvgPerMonth { get; set; }
        public double TotalSpend { get; set; }
    }
}
