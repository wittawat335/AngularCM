using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RestfulApi.Models;

namespace RestfulApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly CMDBContext _context;
        private AppSetting _appSetting;

        public UserController(CMDBContext context, IOptions<AppSetting> appSetting)
        {
            _context = context;
            _appSetting = appSetting.Value;
        }

        // GET: api/User
        [HttpGet]
        public IEnumerable<Users> GetUsers()
        {
            return _context.Users;
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsers([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var users = await _context.Users.FindAsync(id);

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsers([FromRoute] int id, [FromBody] Users users)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != users.Id)
            {
                return BadRequest();
            }

            _context.Entry(users).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

       // POST: api/User
       //[HttpPost]
       // public async Task<IActionResult> PostUsers([FromBody] Users users)
       // {
       //     if (!ModelState.IsValid)
       //     {
       //         return BadRequest(ModelState);
       //     }

       //     _context.Users.Add(users);
       //     await _context.SaveChangesAsync();

       //     return CreatedAtAction("GetUsers", new { id = users.Id }, users);
       // }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Users model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                       return BadRequest(ModelState);
                }

                model.Password = Crypto.HashPassword(model.Password);
                model.CreateDate = DateTime.Now;

               _context.Users.Add(model);
               await _context.SaveChangesAsync();


                return Ok(new { result = "ok", message = "register successfully" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "failure", message = error });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Users model)
        {
            try
            {
                var result = _context.Users.SingleOrDefault(u => u.Username == model.Username);
                if (result == null)
                {
                    return BadRequest(new { token = "", message = "username invalid" });
                }
                else if (Crypto.VerifyHashedPassword(result.Password, model.Password))
                {
                    var token = BuildToken(result);
                    return Ok(new { token = token, message = "login successfully" });
                }

                return BadRequest(new { token = "", message = "password invalid" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "failure", message = error });
            }
        }

        private string BuildToken(Users user)
        {
            // key is case-sensitive
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, _appSetting.Subject),
                new Claim("id", user.Id.ToString()),
                new Claim("username", user.Username),
                new Claim("position", user.Position),
                // for testing [Authorize(Roles = "admin")]
                // new Claim("role", "admin"),
                // new Claim(ClaimTypes.Role, user.Position)
            };

            var expires = DateTime.UtcNow.AddDays(Convert.ToDouble(_appSetting.ExpireDay));

            //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSetting.JWT_Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _appSetting.Issuer,
                audience: _appSetting.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // DELETE: api/User/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteUsers([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var users = await _context.Users.FindAsync(id);
        //    if (users == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Users.Remove(users);
        //    await _context.SaveChangesAsync();

        //    return Ok(users);
        //}

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}