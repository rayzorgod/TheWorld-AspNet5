using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using Microsoft.Framework.DependencyInjection;
using TheWorld.Services;
using Microsoft.Framework.Configuration;
using Microsoft.Dnx.Runtime;
using TheWorld.Models;
using Microsoft.Framework.Logging;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Authentication.Cookies;
using System.Net;
using Microsoft.AspNet.Hosting;

namespace TheWorld
{
    public class Startup
    {
        public static IConfigurationRoot Configuration;
        public Startup(IApplicationEnvironment appEnv)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(appEnv.ApplicationBasePath)
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(config =>
            {
#if !DEBUG
                config.Filters.Add(new RequireHttpsAttribute());
#endif
            })
            .AddJsonOptions(opt =>
            {
                opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            services.AddIdentity<WorldUser, IdentityRole>(config =>
            {
                config.User.RequireUniqueEmail = true;
                config.Password.RequiredLength = 8;
                config.Cookies.ApplicationCookie.LoginPath = "/Auth/Login";
                //config.Cookies.ApplicationCookie.ReturnUrlParameter = "returnUrl";  //returnUrl is set by default
                config.Cookies.ApplicationCookie.Events = new CookieAuthenticationEvents()
                {
                    //Cookies authentication for api, it would return the login html page and status 200 to the caller so if
                    //the url cotains api and it's an unauthorized access then return accessed unauthorized status code only.
                    OnRedirect = ctx =>
                    {
                        if (ctx.Request.Path.StartsWithSegments("/api") &&
                        ctx.Response.StatusCode == (int)HttpStatusCode.OK)
                        {
                            ctx.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        }
                        else
                        {
                            ctx.Response.Redirect(ctx.RedirectUri);
                        }
                        return Task.FromResult(0);
                    }
                };
            })
            .AddEntityFrameworkStores<WorldContext>();

            services.AddLogging();

            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<WorldContext>();

            services.AddScoped<CoordService>();

            services.AddSingleton<WorldContextSeedData>();
            services.AddScoped<IWorldRepository, WorldRepository>();
#if DEBUG
            services.AddScoped<IMailService, DebugMailService>();
#else
           // services.AddScoped<IMailService, RealMailService>();
#endif
        }

        public async void Configure(IApplicationBuilder app, WorldContextSeedData seeder, ILoggerFactory loggerFactory, 
            IHostingEnvironment env) //IHostingEnvironment will tell us if we are on Development, Staging or Production Environment
        {
            if(env.IsDevelopment())
            {
                loggerFactory.AddDebug(LogLevel.Information);
                app.UseDeveloperExceptionPage(); //This is an exception page when error happen, gives alot of information like stack traces and associated data that you only want to show in Development mode
            }
            else
            {
                //So only log errors or above outside Development...we could also change the provider to log into the database
                loggerFactory.AddDebug(LogLevel.Error);
                app.UseExceptionHandler("/App/Error"); //Show a more user friendly error page, opps have not created the Error page yet though here.
            }
            

            app.UseStaticFiles();

            app.UseIdentity();

            AutoMapper.Mapper.Initialize(config =>
            {
                config.CreateMap<Trip, TripViewModel>().ReverseMap();
                config.CreateMap<Stop, StopViewModel>().ReverseMap();
            });

            app.UseMvc(config =>
            {
                config.MapRoute(
                    name: "Default",
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "App", Action = "Index" }
                    );
            });

            await seeder.EnsureSeedDataAsync();
        }
    }
}
