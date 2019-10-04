using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using RestfulApi.Models;

namespace RestfulApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Inject Appsettings
            services.Configure<AppSetting>(Configuration.GetSection("Jwt"));

            // JOsn result setting
            services.AddMvc()
                 .AddJsonOptions(options =>
                 {
                     var resolver = options.SerializerSettings.ContractResolver;
                     if (resolver != null)
                         (resolver as DefaultContractResolver).NamingStrategy = null;
                 })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            //EFCore Setting
            services.AddDbContext<CMDBContext>(options =>
   options.UseSqlServer(Configuration.GetConnectionString("IdentityConnection")));

            // api setting
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                });

                options.AddPolicy("AllowOriginsSpecific", builder =>
                {
                    builder.WithOrigins(
                     "http://localhost:4200",
                     "https://www.w3schools.com")
                     .AllowCredentials()
                     .AllowAnyHeader()
                     .AllowAnyMethod();
                });
            });
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = Configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero, // disable delay when token is expire
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:JWT_Secret"]))
                };
            });

            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new CorsAuthorizationFilterFactory("AllowAll"));
            });
            ////////////////////////////////////////////////////////////////////////////////////////////////

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            // add ใหม่
            app.UseCors(builder => builder.WithOrigins(Configuration["Jwt:Client_URL"].ToString())
               .AllowAnyHeader()
               .AllowAnyMethod()); //

            app.UseAuthentication();
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
