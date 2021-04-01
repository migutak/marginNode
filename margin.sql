create database margin;

create table tblusers(
 userName varchar(100) not null primary key,
 firstName varchar(100),
 lastName varchar(100),
 middleName varchar(100),
 emailAddress varchar(100),
 phoneNumber varchar(100),
 addressLine1 varchar(100),
 addressLine2 varchar(100),
 city varchar(100),
 postCode varchar(100),
 country varchar(100),
 password varchar(100),
 partnerID varchar(100)
);

create table tblpartners(
  partnerID varchar(100) not null primary key,
  partnerName varchar(100),
  adminUser varchar(100),
  emailAddress varchar(100)
);
-- drop table spotorders;
--alter table moneymarketorders add orderindex varchar(100);
create table spotorders (
  orderindex int auto_increment not null primary key,
  orderid varchar(100),
  orderdate timestamp default current_timestamp,
  usernamefk varchar(100),
  ccypair varchar(100),
  sellorderamount float,
  buyorderamount float,
  buysell varchar(100),
  buysellbank varchar(100),
  settlementdate varchar(100),
  custcomment varchar(100),
  ordertypefk varchar(100),
  recipient varchar(100),
  ccysellorderamount varchar(100),
  ccybuyorderamount varchar(100),
  currentstatus varchar(100) default 'N'
);
-- drop table Forwardorders;

create table Forwardorders(
  orderindex int auto_increment not null primary key,
  orderid varchar(100),
  forwardid varchar(100),
  orderdate timestamp default current_timestamp,
  usernamefk varchar(100),
  ccypair varchar(100),
  buyorderamountccy varchar(100),
  buyorderamount varchar(100),
  sellorderamountccy varchar(100),
  sellorderamount varchar(100),
  buysell varchar(100),
  buysellbank varchar(100),
  recipient varchar(100),
  custcomment varchar(100),
  ordertypefk varchar(100),
  freq varchar(100),
  freqnum int,
  startdate varchar(100),
  currentstatus varchar(100) default 'N',
  settlementdate varchar(100)
);
                  

-- update spotorders set currentstatus = 'N';

create or replace view v_orders as 
select orderid, count(orderid) nOffers from spotorders 
where currentstatus = 'OfferReceived'
GROUP BY orderid;  


create or replace view v_mmorders as 
select orderid orderidfk, count(orderid) nOffers from Moneymarketorders 
where currentstatus = 'OfferReceived'
GROUP BY orderid; 


create or replace view v_forwardoffers as 
select orderid orderidfk, count(orderid) nOffers from Forwardorders 
where currentstatus = 'OfferReceived'
GROUP BY orderid; 

create or replace view v_swaporders as 
select orderid orderidfk, count(orderid) nOffers from Swaporders 
where currentstatus = 'OfferReceived'
GROUP BY orderid; 

create table Swaporders (
  orderindex int auto_increment not null primary key,
  orderid varchar(100),
  orderdate timestamp default current_timestamp,
  usernamefk varchar(100),
  ccypair varchar(100),
  nearbuyorderamountccy varchar(100),
  nearbuyorderamount float,
  nearsellorderamountccy varchar(100),
  nearsellorderamount float,
  buysell varchar(100),
  buysellbank varchar(100),
  recipient varchar(100),
  neardate varchar(100),
  fardate varchar(100),
  farbuyorderamountccy varchar(100),
  farbuyorderamount float,
  farsellorderamountccy varchar(100),
  farsellorderamount float,
  custcomment varchar(100),
  ordertypefk varchar(100),
  currentstatus varchar(100) default 'N'
);
---drop table offers_swap;

create table offers_swap(
  offerid int auto_increment not null primary key,
  orderindex varchar(100),
  orderidfk varchar(100),
  nearspot varchar(100),
  createdate timestamp default current_timestamp,
  nearmargin float,
  nearfinal float,
  nearbuyorderamountccy varchar(100),
  nearbuyorderamount varchar(100),
  nearsellorderamountccy varchar(100),
  nearsellorderamount varchar(100),
  neardate varchar(100),
  farspot float,
  farmargin varchar(100),
  farfinal varchar(100),
  farbuyorderamountccy varchar(100),
  farbuyorderamount varchar(100),
  farsellorderamountccy varchar(100),
  farsellorderamount varchar(100),
  fardate varchar(100),
  comment varchar(100),
  offeredby varchar(100),
  bankuser varchar(100),
  orderdate varchar(100),
  status varchar(100) default 'Open',
  confirm varchar(100) default 'Pending',
  confirmdate varchar(100)
);

create table banks (
  bankid varchar(100) not null primary key,
  bankname varchar(100) not null
);

select * from swaporders;
select * from spotorders;
select * from offers;

insert into banks values
('bank1','Kenya Commercial Bank Limited'),
('bank2','Standard Chartered Bank Kenya'),
('bank3','Barclays Bank of Kenya Limited'),
('bank5','Bank of India'),
('bank6','Bank of Baroda (Kenya) Limited')

-- drop table offers;
select * from offers_mm;
select * from Moneymarketorders;
update offers_mm set status= 'Open' where status is null;

create table offers(
  offerid int auto_increment primary key,
  orderindex varchar(100) not null,
  orderidfk varchar(100) not null,
  spotrate float,
  magin float,
  offeredrate float,
  settlementdate varchar(100) not null,
  offeredby varchar(100) not null,
  ccysettleamount varchar(100),
  settleamount float,
  offerdate varchar(100),
  offercomment varchar(100) not null,
  bankuser varchar(100) not null,
  status varchar(100) default 'Open',
  confirm varchar(100) default 'Pending',
  confirmdate varchar(100)
);


select * from offers_forward;
select * from Moneymarketorders;
select * from swaporders;

select distinct m.orderid,usernamefk,ccy,orderamount,mmfrom,mmto,tenuredays,
custcomment,ordertypefk,mmtype,nOffers 
 from Moneymarketorders m left outer join v_mmorders v on m.orderid=v.orderidfk 
 where m.currentstatus in ('N','OfferReceived') and usernamefk = 'cust1@example.com';
            
create table offers_forward(
  offerid int auto_increment primary key,
  orderindex varchar(100),
  orderidfk varchar(100),
  spot float,
  margin float,
  finalrate float,
  settlementamountccy varchar(100),
  settlementamount varchar(100),
  settlementdate varchar(100),
  bankcomment varchar(100),
  offeredby varchar(100),
  bankuser varchar(100),
  orderdate varchar(100),
  status varchar(100) default 'Open',
  confirm varchar(100) default 'Pending',
  offerdate timestamp default current_timestamp,
  confirmdate varchar(100)
);
  
-- drop table offers_forward;
                  
create table Moneymarketorders(
  orderindex int auto_increment not null primary key,
  orderid varchar(100),
  orderdate timestamp default current_timestamp,
  usernamefk varchar(100),
  ccy varchar(100),
  orderamount float,
  mmfrom varchar(100),
  mmto varchar(100),
  tenuredays int,
  recipient varchar(100),
  custcomment varchar(100),
  ordertypefk varchar(100),
  mmtype varchar(100),
  mmtypebank varchar(100),
  custname varchar(100),
  currentstatus varchar(100) default 'N'
);

select * from Moneymarketorders;
select * from v_mmorders;

select distinct m.orderid,usernamefk,ccy,orderamount,mmfrom,mmto,
tenuredays,custcomment,ordertypefk,mmtype,nOffers 
from Moneymarketorders m left outer join v_mmorders v on m.orderid=v.orderidfk 
where m.currentstatus in (?,?) and usernamefk = ? ',['N','OfferReceived','dealer1@customer1.com']
           

create table currencies (
code varchar(100) not null primary key,
description varchar(100)
);
insert into currencies values
('USD/KES','USD/KES'),
('KES/UGX','KES/UGX'),

truncate table Moneymarketorders;

create table offers_mm (
  offerid int auto_increment not null primary key,
  orderindex varchar(100),
  orderidfk varchar(100),
  fixedrate varchar(100),
  orderamount varchar(100),
  daycount varchar(100),
  totalinterest float,
  tax float,
  netinterest float,
  bankcomment varchar(100),
  offeredby varchar(100),
  bankuser varchar(100),
  currentstatus varchar(100) default 'N',
  offerdate varchar(100),
  orderdate varchar(100),
  status varchar(100) default 'Open',
  confirm varchar(100) default 'Pending',
  confirmdate varchar(100)
);
                       
select * from spotorders;                      
