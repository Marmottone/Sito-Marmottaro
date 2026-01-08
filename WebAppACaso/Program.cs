var builder = WebApplication.CreateBuilder(args);

// Aggiungi i servizi al container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configura la pipeline delle richieste HTTP.
if (!app.Environment.IsDevelopment())
{
  app.UseExceptionHandler("/Home/Error");
  //app.UseHsts();
}

// Nota: Su AlwaysData la gestione HTTPS è spesso fatta dal loro proxy esterno.
// Se il sito ti dà errori di "Too many redirections", potresti dover commentare la riga sotto.
//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// --- MODIFICA PER ALWAYSDATA ---
// Recupera la porta assegnata dal sistema, altrimenti usa la 5000 come fallback locale
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";

// Invece di usare http://0.0.0.0:port o localhost
app.Urls.Add($"http://*:{port}");
app.Run();
// -------------------------------