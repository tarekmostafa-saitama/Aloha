using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Application.Requests.ConversationHistory.Models;

public class ConversationHistoryDto
{
    public int Id { get; set; }

    public DateTime DateTime { get; set; }

    public ConversationType ConversationType { get; set; }
}