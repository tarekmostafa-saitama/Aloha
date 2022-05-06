using CleanArchitecture.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CleanArchitecture.WebUI.Hubs;

[Authorize]
public class TextChatHub: Hub
{
    private readonly ITextChatQueueService _textChatQueueService;
    private readonly IVideoChatQueueService _videoChatQueueService;

    public TextChatHub(ITextChatQueueService textChatQueueService, IVideoChatQueueService videoChatQueueService)
    {
        _textChatQueueService = textChatQueueService;
        _videoChatQueueService = videoChatQueueService;
    }
    public async Task RouteTextMessage(string message)
    {
        var otherConnectionId = _textChatQueueService.GetOtherMemberConnectionId(Context.ConnectionId);
        if (string.IsNullOrWhiteSpace(otherConnectionId))
        {
            await Clients.Caller.SendAsync("");
            return;
        }
        await Clients.Client(otherConnectionId).SendAsync("receiveTextMessage", new { TextMessage = message, Type = 2 });
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
    public async Task RegisterToVideoQueue()
    {
        var result = _videoChatQueueService.RequestQueue(Context.ConnectionId);
        if (string.IsNullOrWhiteSpace(result))
        {
            await Clients.Caller.SendAsync("waitingRandomVideoChat");
            return;
        }
        _videoChatQueueService.AddToPair(Context.ConnectionId, result);
        await Clients.Caller.SendAsync("setupRandomVideoChat", result,true);
        await Clients.Client(result).SendAsync("setupRandomVideoChat", Context.ConnectionId,false);

    }
    public async Task UnRegisterFromVideoQueue()
    {
        var queueResult = _videoChatQueueService.RemoveFromQueue(Context.ConnectionId);
        if (!queueResult)
        {
            var otherId = _videoChatQueueService.RemoveFromPair(Context.ConnectionId);
            if (!string.IsNullOrWhiteSpace(otherId))
                await Clients.Client(otherId).SendAsync("disconnectedRandomVideoChat");
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


        var queueResult2 = _videoChatQueueService.RemoveFromQueue(Context.ConnectionId);
        if (!queueResult)
        {
            var otherId = _videoChatQueueService.RemoveFromPair(Context.ConnectionId);
            if (!string.IsNullOrWhiteSpace(otherId))
                Clients.Client(otherId).SendAsync("disconnectedRandomVideoChat");
        }

        return base.OnDisconnectedAsync(exception);
    }
}
