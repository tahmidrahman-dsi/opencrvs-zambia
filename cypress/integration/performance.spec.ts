/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
 * graphic logo are (registered/a) trademark(s) of Plan International.
 */
/// <reference types="Cypress" />

context('Performance view', () => {
  beforeEach(() => {
    cy.initializeFakeTimers()
    indexedDB.deleteDatabase('OpenCRVS')
    cy.registerApplicationWithMinimumInput('Yeasin', 'Hossein')
  })

  it('allows downloading all metrics data as a CSV', () => {
    cy.server()
    cy.route('GET', '**/metrics/export').as('getExport')
    cy.get('#menu-performance').click()
    cy.get('#export-all-button').click()
    cy.wait('@getExport')
  })
})
