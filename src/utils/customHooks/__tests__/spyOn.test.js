const video = require('../spyOn');

test('plays video', () => {
    const spy = jest.spyOn(video, 'play');
    const isPlaying = video.play('pp');

    console.log('@@@@ spy func', spy.mock.calls)

    expect(spy).toHaveBeenCalled();
    expect(isPlaying).toBe(true);

    spy.mockRestore();
});