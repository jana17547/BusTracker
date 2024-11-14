using System.Threading.Tasks;
using Cassandra;

namespace Server.Interfaces
{
    public interface IDataStaxService
    {
        ISession Session { get; }
    }
}