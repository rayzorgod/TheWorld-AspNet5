using Microsoft.AspNet.Identity.EntityFramework;
using System;

namespace TheWorld.Models
{
    public class WorldUser : IdentityUser  //Extend the IdentityUser with own stuff
    {
        //First time they create a trip , will have a place on the user to store it.
        public DateTime FirstTrip { get; set; }
    }
}