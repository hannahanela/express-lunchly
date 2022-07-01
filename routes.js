"use strict";

/** Routes for Lunchly */

const express = require("express");

const Customer = require("./models/customer");
const Reservation = require("./models/reservation");

const router = new express.Router();

/** Homepage: show list of customers. */

router.get("/", async function (req, res, next) {
  console.log("show list of customers###############");
  const customers = await Customer.all();
  return res.render("customer_list.html", { customers });
});

/** Form to add a new customer. */

router.get("/add/", async function (req, res, next) {
  return res.render("customer_new_form.html");
});

/** Handle adding a new customer. */

router.post("/add/", async function (req, res, next) {
  const { firstName, lastName, phone, notes } = req.body;
  const customer = new Customer({ firstName, lastName, phone, notes });
  await customer.save();

  return res.redirect(`/${customer.id}/`);
});

/** Show a customer, when searched for by full name. */

router.get("/search", async function (req, res, next) {
  // original query process
  // const customerSearch = await Customer.get(req.query.firstName);
  // const firstName = customerSearch.split(' ')[0]
  // const lastName = customerSearch.split(' ')[1]
  console.log("show customer search route***************");
  const firstName = await Customer.get(req.query.firstName);
  const lastName = await Customer.get(req.query.lastName);
  console.log(customerSearch);
  
  const customerId = await customerSearch.getByFullName(firstName, lastName);
  const customer = await Customer.get(Number(customerId));
  console.log(customer);
  const reservations = await customer.getReservations();

  return res.render("customer_detail.html", { customer, reservations })
});

/** Show a customer, given their ID. */
// /search
router.get("/:id/", async function (req, res, next) {
  console.log("get customer by id route", req.params.id);
  const customer = await Customer.get(req.params.id);

  const reservations = await customer.getReservations();

  return res.render("customer_detail.html", { customer, reservations });
  
});

/** Show form to edit a customer. */

router.get("/:id/edit/", async function (req, res, next) {
  const customer = await Customer.get(req.params.id);

  res.render("customer_edit_form.html", { customer });
});

/** Handle editing a customer. */

router.post("/:id/edit/", async function (req, res, next) {
  const customer = await Customer.get(req.params.id);
  customer.firstName = req.body.firstName;
  customer.lastName = req.body.lastName;
  customer.phone = req.body.phone;
  customer.notes = req.body.notes;
  await customer.save();

  return res.redirect(`/${customer.id}/`);
});

/** Handle adding a new reservation. */

router.post("/:id/add-reservation/", async function (req, res, next) {
  const customerId = Number(req.params.id);
  const startAt = new Date(req.body.startAt);
  const numGuests = Number(req.body.numGuests);
  const notes = req.body.notes;

  const reservation = new Reservation({
    customerId,
    startAt,
    numGuests,
    notes,
  });
  await reservation.save();

  return res.redirect(`/${customerId}/`);
});

module.exports = router;
