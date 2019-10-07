using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestfulApi.Models;

namespace RestfulApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly CMDBContext _context;
        private readonly IHostingEnvironment env;

        public ProductController(CMDBContext context, IHostingEnvironment environment)
        {
            _context = context;
            env = environment;
        }

        [HttpGet("count/out_of_stock")]
        public IActionResult GetOutOfStock()
        {
            try
            {
                var count = _context.Products.Where(p => p.Stock == 0).Count();
                return Ok(new { out_of_stock_product = count, message = "request successfully" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }
        }

        // GET: api/Product
        [HttpGet]
        public IActionResult GetProducts()
        {
            try
            {
                var result = _context.Products.ToList();
                return Ok(new { result = result, message = "request successfully" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            try
            {
                var result = _context.Products.SingleOrDefault(p => p.ProductId == id);

                if (result == null)
                {
                    return NotFound();
                }
                return Ok(new { result = result, message = "request successfully" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducts([FromRoute] int id, [FromBody] Products products)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != products.ProductId)
            {
                return BadRequest();
            }

            _context.Entry(products).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductsExists(id))
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

        // POST: api/Product
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromForm] Products model)
        {
            try
            {
                string fileName = await UploadProductImages();
                model.Image = fileName;
                model.CreateDate = DateTime.Now;

                _context.Add(model);
                _context.SaveChanges();

                return Ok(new { result = model, message = "create product successfully" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }
        }

        public async Task<String> UploadProductImages()
        {
            // Note: recommended used async Task

            var files = Request.Form.Files;
            string filePath = "";

            if (files.Count > 0)
            {
                const string folder = "/images/";
                filePath = env.WebRootPath + folder;
       
                string fileName = "";
                //var fileNameArray = new List<String>(); // multiple images case

                if (!Directory.Exists(filePath))
                {
                    Directory.CreateDirectory(filePath);
                }

                foreach (var formFile in files)
                {
                    fileName = Guid.NewGuid().ToString() + System.IO.Path.GetExtension(formFile.FileName); // unique name
                    string fullPath = filePath + fileName;

                    if (formFile.Length > 0)
                    {
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);
                        }
                    }

                    // fileNameArray.Add(fileName); // multiple images case
                }

                return fileName;
                //return fileNameArray; // multiple images case
            }
            return String.Empty;
            //return null;      // multiple images case
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducts([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var products = await _context.Products.FindAsync(id);
            if (products == null)
            {
                return NotFound();
            }

            _context.Products.Remove(products);
            await _context.SaveChangesAsync();

            return Ok(products);
        }

        private bool ProductsExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}