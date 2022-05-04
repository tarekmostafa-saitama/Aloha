namespace CleanArchitecture.Application.Common.Interfaces;

public interface ITextChatQueueService
{
    string GetOtherMemberConnectionId(string myConnectionId);


    bool RemoveFromQueue(string myConnectionId);
    string RequestQueue(string myConnectionId);



    string RemoveFromPair(string myConnectionId);
    void AddToPair(string myConnectionId, string otherConnectionId);
}