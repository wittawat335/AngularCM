using System;
using System.Collections.Generic;

namespace RestfulApi.Models
{
    public partial class OrderItem
    {
        public int OrderItemId { get; set; }
        public int TransactionId { get; set; }
        public int ProductId { get; set; }
        public int? Qty { get; set; }

        public Transaction Transaction { get; set; }
    }
}
