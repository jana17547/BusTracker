
using System;
using Cassandra;
using System.Threading;
using Server.Models;
using System.Threading.Tasks;

namespace Server.Services
{
  public class AstraService : Interfaces.IDataStaxService
  {
    private ISession _session;
    public ISession Session
    {
      get
      {
        if (_session == null)
        {
          _session = Cluster.Builder()
                                  .WithCloudSecureConnectionBundle("secure-connect-bustracker.zip")
                                  .WithCredentials("AClhzEdyqifppsOlzKUufdqv", "JJqq9D6MYy6m3ZsWbjDLT,lPZj4tC.PB_bDl,vegPKdLMZfNc8+6bYHFW6FntoTtS+ZfLDFhh2K5,zLqP6eD217ZI,mhlvpI0xcQsd5MJda_AI-Z+CJD3krJNaqoDhTq")
                                  .Build()
                                  .Connect();
        }
        return _session;
      }
    }
  }
}