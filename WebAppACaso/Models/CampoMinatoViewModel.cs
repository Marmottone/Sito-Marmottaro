using System.ComponentModel.DataAnnotations;

namespace WebAppACaso.Models
{
  public class CampoMinatoViewModel
  {
    [Range(2, 15, ErrorMessage = "Inserisci un numero tra 2 e 15")]
    public int Grandezza { get; set; }

    public string[][] PopolaMatrice()
    {
      string[][] matrice = new string[this.Grandezza][];
      var random = new Random();

      for (int i = 0; i < this.Grandezza; i++)
      {
        matrice[i] = new string[this.Grandezza];
        for (int j = 0; j < this.Grandezza; j++)
        {
          if (random.Next(0, 5) == 0) matrice[i][j] = "💣";
          else matrice[i][j] = "";
        }
      }

      for (int i = 0; i < this.Grandezza; i++)
      {
        for (int j = 0; j < this.Grandezza; j++)
        {
          if (matrice[i][j] != "💣")
          {
            int mineVicine = ContaMineVicine(matrice, i, j);
            matrice[i][j] = mineVicine.ToString();
          }
        }
      }

      return matrice;
    }

    private int ContaMineVicine(string[][] matrice, int riga, int colonna)
    {
      int conteggio = 0;

      for (int r = riga - 1; r <= riga + 1; r++)
      {
        for (int c = colonna - 1; c <= colonna + 1; c++)
        {
          // Verifica che non siamo fuori dai bordi della matrice
          if (r >= 0 && r < this.Grandezza && c >= 0 && c < this.Grandezza)
          {
            if (matrice[r][c] == "💣")
            {
              conteggio++;
            }
          }
        }
      }
      return conteggio;
    }

    public int ContaMine(string[][] matrice)
    {
      int cntMine = 0;

      for (int i = 0; i < this.Grandezza; i++)
      {
        for (int j = 0; j < this.Grandezza; j++)
        {
          if (matrice[i][j] == "💣")
          {
            cntMine++;
          }
        }
      }

      return cntMine;
    }
  }
}
