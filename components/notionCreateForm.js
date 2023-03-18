const NotionCreateForm = ({ createMessageinput, createinput, onCreate }) => {
  return (
    <form onSubmit={onCreate}>
      <h2>Notion data create</h2>
      <input
        type="text"
        style={{ width: "1000px", height: "24px" }}
        value={createinput}
        onChange={(e) => createMessageinput(e.target.value)}
      />
      <input type="submit" value="生成" />
    </form>
  );
};

export default NotionCreateForm;
