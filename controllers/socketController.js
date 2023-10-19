const { Product } = require('../db/index')

exports.handleSetup = (socket) => {
  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter((user) => user !== socket.user_id);
    socket.to(socket.chat_id).emit('user_online_status', false);
  });
};

exports.handleProduct = (socket) => {
  console.log('111111111111111111');
  socket.on('product_list', async (data) => {
    let productList = await Product.find({ category: data.category }).skip(data.page - 1).limit(data.size);
    if (productList && productList.length > 0) {
      socket.emit('product_list', productList);
    }
    else {
      socket.emit('product_list', "No Product Found");
    }
  });
}

