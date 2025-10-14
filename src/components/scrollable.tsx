export const SelectDir = () => {
  return (
    <scrollbox
      style={{
        rootOptions: {
          backgroundColor: "#24283b",
        },
        wrapperOptions: {
          backgroundColor: "#1f2335",
        },
        viewportOptions: {
          backgroundColor: "#1a1b26",
        },
        contentOptions: {
          backgroundColor: "#16161e",
        },
        scrollbarOptions: {
          showArrows: true,
          trackOptions: {
            foregroundColor: "#7aa2f7",
            backgroundColor: "#414868",
          },
        },
      }}
      focused
    >
      {Array.from({ length: 16 }).map((_, i) => {
        return (
          <box
            key={i}
            style={{
              width: "100%",
              padding: 2,
              marginBottom: 2,
            }}
          >
            <text
              style={{
                marginBottom: 1,
              }}
              content={`Box ${i + 1}`}
            />
          </box>
        );
      })}
    </scrollbox>
  );
};
