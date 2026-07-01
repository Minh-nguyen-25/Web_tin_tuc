using System;
namespace DemoApp
{
class Program
{
static void Main(string[] args)
{
Console.WriteLine("Demo C# Program");
bool run = true;
while (run)
{
Console.WriteLine("1 Sum");
Console.WriteLine("2 Fact");
Console.WriteLine("3 Prime");
Console.WriteLine("0 Exit");
Console.Write("Choice:");
int c = int.Parse(Console.ReadLine());
if (c == 0) { run = false; }
else if (c == 1)
{
Console.Write("a:"); int a = int.Parse(Console.ReadLine());
Console.Write("b:"); int b = int.Parse(Console.ReadLine());
Console.WriteLine(a + b);
}
else if (c == 2)
{
Console.Write("n:"); int n = int.Parse(Console.ReadLine());
int f = 1;
for (int i = 1; i <= n; i++) f *= i;
Console.WriteLine(f);
}
else if (c == 3)
{
Console.Write("n:"); int n = int.Parse(Console.ReadLine());
bool p = n > 1;
for (int i = 2; i * i <= n; i++)
{
if (n % i == 0) { p = false; break; }
}
Console.WriteLine(p);
}
else
{
Console.WriteLine("Invalid");
}
}
}
}
}
// end file