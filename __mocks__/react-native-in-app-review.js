const InAppReview = {
    isAvailable: jest.fn(() => true),
    RequestInAppReview: jest.fn(() => Promise.resolve(true)),
}

module.exports = InAppReview
module.exports.default = InAppReview

