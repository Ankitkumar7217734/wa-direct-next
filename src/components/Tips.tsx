const TIPS = [
  {
    step: "1",
    text: (
      <>
        Pick the <strong>country code</strong> and type the phone number — no
        need to save the contact first.
      </>
    ),
  },
  {
    step: "2",
    text: (
      <>
        Add an optional <strong>pre-filled message</strong> so the chat opens
        with text ready to send.
      </>
    ),
  },
  {
    step: "3",
    text: (
      <>
        Tap <strong>Open WhatsApp Chat</strong> and the conversation launches in
        WhatsApp instantly.
      </>
    ),
  },
];

export function Tips() {
  return (
    <div className="wa-tips-card">
      <div className="wa-tips-title">How it works</div>
      {TIPS.map((tip) => (
        <div key={tip.step} className="wa-tip-row">
          <div className="wa-tip-dot">{tip.step}</div>
          <div className="wa-tip-text">{tip.text}</div>
        </div>
      ))}
    </div>
  );
}
