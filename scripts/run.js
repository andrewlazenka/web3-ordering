const main = async () => {
  const restaurantOrderFactory = await hre.ethers.getContractFactory(
    "RestaurantOrder"
  );
  const orderContract = await restaurantOrderFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await orderContract.deployed();

  // contract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    orderContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let orderTxn = await orderContract.placeOrder({
    tableSize: 1,
    drink: "Coca Cola",
    appetizer: "Salad",
    main: "Steak & Potatoes",
  });
  const receipt = await orderTxn.wait();
  console.log('Emitted events - ', receipt.events.length);

  const [_, randomPerson] = await hre.ethers.getSigners();
  await orderContract.connect(randomPerson).placeOrder({
    tableSize: 2,
    drink: "Pepsi",
    appetizer: "Fries",
    main: "Burger",
  });

  // contract balance
  contractBalance = await hre.ethers.provider.getBalance(
    orderContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  const totalOrders = await orderContract.getTotalOrders();
  console.log(`${totalOrders} order(s) placed in total`);

  const orders = await orderContract.getAllOrders();
  console.log(orders);
};

main();
