package com.govstart.dto;

import java.util.List;
import java.util.Map;

public class ChatResponseDto {
    private String query;
    private String answer;
    private boolean flagged;
    private String reason;
    private List<Map<String, String>> citations;
    private String tenderReference;
    private String disclaimer;

    public ChatResponseDto() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public boolean isFlagged() { return flagged; }
    public void setFlagged(boolean flagged) { this.flagged = flagged; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public List<Map<String, String>> getCitations() { return citations; }
    public void setCitations(List<Map<String, String>> citations) { this.citations = citations; }

    public String getTenderReference() { return tenderReference; }
    public void setTenderReference(String tenderReference) { this.tenderReference = tenderReference; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
