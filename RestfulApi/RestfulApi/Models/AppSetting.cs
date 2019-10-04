using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestfulApi.Models
{
    public class AppSetting
    {
        public string JWT_Secret { get; set; }
        public string Client_URL { get; set; }
        public string Issuer { get; set; }
        public string Subject { get; set; }
        public string Audience { get; set; }
        public string ExpireDay { get; set; }
    }
}
