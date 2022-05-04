using CleanArchitecture.Application.Common.Interfaces;

namespace CleanArchitecture.Infrastructure.Services;

public class TextChatQueueService: ITextChatQueueService
{
    private static Dictionary<string, string> Pairs { get;} = new Dictionary<string, string>();
    private static List<string> WaitingQueue { get;} = new List<string>();

    private static readonly Object Obj = new Object();

    public string GetOtherMemberConnectionId(string myConnectionId)
    {
        lock (Obj)
        {
            if (Pairs.ContainsKey(myConnectionId))
            {
                return Pairs[myConnectionId];
            }
            if (Pairs.ContainsValue(myConnectionId))
            {
                var item = Pairs.FirstOrDefault(kvp => kvp.Value == myConnectionId);
                if (!item.Equals(default(KeyValuePair<string, string>)))
                {
                    return item.Key;
                }

            }
        }
        return String.Empty;
    }

    public bool RemoveFromQueue(string myConnectionId)
    {
        lock (Obj)
        {
            return WaitingQueue.Remove(myConnectionId);
        }
    }

    public string RequestQueue(string myConnectionId)
    {
        lock (Obj)
        {
            if (WaitingQueue.Count == 0)
            {
                WaitingQueue.Add(myConnectionId);
                return String.Empty;
            }

            var otherConnectionId = WaitingQueue[0];
            WaitingQueue.RemoveAt(0);
            return otherConnectionId;
        }
    }

    public string RemoveFromPair(string myConnectionId)
    {
        lock (Obj)
        {
            if (Pairs.ContainsKey(myConnectionId))
            {
                Pairs.Remove(myConnectionId, out string otherValue);
                return otherValue;
            }
            if(Pairs.ContainsValue(myConnectionId))
            {
                var item = Pairs.FirstOrDefault(kvp => kvp.Value == myConnectionId);
                if (!item.Equals(default(KeyValuePair<string, string>)))
                {
                    Pairs.Remove(item.Key);
                    return item.Key;
                }
                
            }
        }

        return string.Empty;
    }

    public void AddToPair(string myConnectionId, string otherConnectionId)
    {
        lock (Obj)
        {
            Pairs.Add(myConnectionId,  otherConnectionId);
        }
    }
}