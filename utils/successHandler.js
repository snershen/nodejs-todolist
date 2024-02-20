export const successHandler = (headers, res, data) => {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      success: true,
      data,
    })
  );
  res.end();
};
