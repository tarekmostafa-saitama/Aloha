using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Domain.Entities;

public class ConversationHistory
{
    public int Id { get; set; }

    public DateTime DateTime { get; set; }

    public ConversationType ConversationType { get; set; }
}