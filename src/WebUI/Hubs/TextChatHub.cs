using CleanArchitecture.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CleanArchitecture.WebUI.Hubs;

[Authorize]
public class TextChatHub: Hub
{
    private readonly ITextChatQueueService _textChatQueueService;

    public TextChatHub(ITextChatQueueService textChatQueueService)
    {
        _textChatQueueService = textChatQueueService;
    }
    public async Task RouteTextMessage()
    {
        var otherConnectionId = _textChatQueueService.GetOtherMemberConnectionId(Context.ConnectionId);
        if (string.IsNullOrWhiteSpace(otherConnectionId))
        {
            await Clients.Caller.SendAsync("");
            return;
        }
        await Clients.Client(otherConnectionId).SendAsync("");
    }
    public async Task RegisterToQueue()
    {
        var result = _textChatQueueService.RequestQueue(Context.ConnectionId);
        if (string.IsNullOrWhiteSpace(result))
        {
            await Clients.Caller.SendAsync("waitingRandomTextChat");
            return;
        }
        _textChatQueueService.AddToPair(Context.ConnectionId, result);
        await Clients.Caller.SendAsync("setupRandomTextChat");
        await Clients.Client(result).SendAsync("setupRandomTextChat");

    }    
    public async Task UnRegisterFromQueue()
    {
        var queueResult = _textChatQueueService.RemoveFromQueue(Context.ConnectionId);
        if (!queueResult)
        {
            var otherId = _textChatQueueService.RemoveFromPair(Context.ConnectionId);
            if (!string.IsNullOrWhiteSpace(otherId))
                await Clients.Client(otherId).SendAsync("disconnectedRandomTextChat");
        }
    }
    
    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var queueResult =_textChatQueueService.RemoveFromQueue(Context.ConnectionId);
        if (!queueResult)
        {
            var otherId = _textChatQueueService.RemoveFromPair(Context.ConnectionId);
            if (!string.IsNullOrWhiteSpace(otherId))
                Clients.Client(otherId).SendAsync("disconnectedRandomTextChat");
        }
        return base.OnDisconnectedAsync(exception);
    }
}
