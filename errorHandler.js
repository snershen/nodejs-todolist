export const errorHandler = (headers, res, message = "格式錯誤") => {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      success: false,
      message,
    })
  );
  res.end();
};
