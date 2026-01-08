using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebAppACaso.Models;

namespace WebAppACaso.Controllers
{
  public class HomeController : Controller
  {
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
      _logger = logger;
    }

    public IActionResult Index()
    {
      return View();
    }

    public IActionResult Privacy()
    {
      return View();
    }

    [HttpGet]
    public IActionResult CampoMinato()
    {
      return View(new CampoMinatoViewModel { Grandezza = 0 });
    }

    [HttpPost]
    public IActionResult CampoMinato(CampoMinatoViewModel model)
    {
      return View(model);
    }

    public IActionResult PlatformMarmotta()
    {
      return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
      return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
  }
}
