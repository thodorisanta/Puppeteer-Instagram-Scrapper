const myUsername = ""; // Place usename here
const myPassword = ""; // Place password here

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch(); //{headless: false}
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/'); //, {waitUntil: 'networkidle2'}

  //login to instagram
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', myUsername);
  await page.type('input[name="password"]', myPassword);
  await page.click('button[type="submit"]');
  
  //once login is complete go to profile
  await page.waitForNavigation();
  await page.goto('https://www.instagram.com/' + myUsername, {waitUntil: 'networkidle2'});





  // Get number of followers and following
  const followersCount = await page.evaluate(() =>  document.querySelector('.k9GMp li a span').textContent );
  console.log("followersCount: " + followersCount);

  const followingCount = await page.evaluate(() =>  document.querySelector('.k9GMp').lastChild.textContent.replace(/\D/g,''));
  console.log("followingCount: " + followingCount);

  //await page.waitFor(1000);




  

  // Open followers List
  await page.click('a[href="/' + myUsername +'/followers/"]');
  //await page.waitFor(1000);
  

  // Scroll until you got the whole list of followers into view
  let followersList = await page.evaluate(() => document.querySelectorAll(".PZuss li").length);
  while(followersList < followersCount){
    await page.waitForSelector('.PZuss');
    await page.evaluate(() =>  document.querySelector(".PZuss").lastChild.scrollIntoView() );
    await page.waitFor(300);
    followersList = await page.evaluate(() => document.querySelectorAll(".PZuss li").length);
    //console.log("followersList: " + followersList);
  }


  const followers = {
    name: await page.evaluate(() => Array.from(document.querySelectorAll('.PZuss li .FPmhX'), element => element.textContent)),
    img: await page.evaluate(() => Array.from(document.querySelectorAll('.PZuss li ._6q-tv'), element => element.src))
  }


  // Close followers window
  await page.click('div > button > div > svg'); 
  await page.waitFor(1000);

  



  
  // Open following List
  await page.click('a[href="/' + myUsername +'/following/"]');
  //await page.waitFor(2000);


  let followingList = await page.evaluate(() => document.querySelectorAll(".PZuss li").length);
  while(followingList < followingCount){
    await page.waitForSelector('.PZuss');
    await page.evaluate(() =>  document.querySelector(".PZuss").lastChild.scrollIntoView() );
    await page.waitFor(300);
    followingList = await page.evaluate(() => document.querySelectorAll(".PZuss li").length);
    //console.log("followingList: " + followingList);
  }


  const following = {
    name: await page.evaluate(() => Array.from(document.querySelectorAll('.PZuss li .FPmhX'), element => element.textContent)),
    img: await page.evaluate(() => Array.from(document.querySelectorAll('.PZuss li ._6q-tv'), element => element.src))
  }

  




  // Make the 3 lists ( friends , fans , notFollowBack )

  let friends = [];
  let fans = [];
  let notFollowBack = [];

 
  friends = followers.name.filter(function(e) {
    return following.name.indexOf(e) > -1;
  });
  console.log("FRIENDS: " + friends.length);


  fans = followers.name.filter(function(e) {
    return following.name.indexOf(e) == -1;
  });
  console.log("FANS: " + fans.length);
  

  notFollowBack = following.name.filter(function(e) {
    return followers.name.indexOf(e) == -1;
  });
  console.log("notFollowBack: " + notFollowBack.length);


  await browser.close();
})();