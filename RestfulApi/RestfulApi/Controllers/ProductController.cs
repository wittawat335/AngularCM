using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("search/name")]
        public IActionResult SearchProduct([FromQuery] string keyword)
        {
            try
            {
                var result = (from product in _context.Products
                              where EF.Functions.Like(product.Name, "%" + keyword + "%")
                              select product).ToList();

                return Ok(new { result = result, message = "request successfully" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }
        }

        [AllowAnonymous]
        [HttpGet("images/{name}")]
        public IActionResult GetImage(String name)
        {
            return File($"~/images/{name}", "image/jpg");
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync([FromForm] Products model, int id)
        {
            try
            {
                var result = _context.Products.SingleOrDefault(x => x.ProductId == id);

                if (result != null)
                {
                    string fileName = await UploadProductImages();

                    if (!String.IsNullOrEmpty(fileName))
                    {
                        result.Image = fileName;
                    }

                    result.Name = model.Name;
                    result.Price = model.Price;
                    result.Stock = model.Stock;

                    _context.Update(result);
                    _context.SaveChanges();

                    return Ok(new { result = "", message = "update product successfully" });
                }
                return NotFound();
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }
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
        public IActionResult Delete(int id)
        {
            try
            {
                var item = _context.Products.SingleOrDefault(p => p.ProductId == id);

                if (item == null)
                {
                    return NotFound();
                }

                _context.Products.Remove(item);
                _context.SaveChanges();

                return Ok(new { result = "", message = "delete product sucessfully" });
            }
            catch (Exception error)
            {
                return StatusCode(500, new { result = "", message = error });
            }
        }

        private bool ProductsExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}