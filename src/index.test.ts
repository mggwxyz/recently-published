import {describe, it, expect} from 'vitest';
import {execa} from 'execa';

type Data = {
  version: string;
  publishDate: string;
};

function extractVersionAndPublishDate(data: Data[]) {
  return data.map(({version, publishDate}) => ({
    version,
    publishDate
  }));
}

describe('CLI Tool Tests', () => {
  it('should return correct data for "recently-published request --display=all --json', async () => {
    const {stdout} = await execa('tsx', ['./src/index.ts', 'request', '--display=all', '--json']);
    const result = JSON.parse(stdout);
    expect(extractVersionAndPublishDate(result)).toEqual(
      extractVersionAndPublishDate(mockDataForDeprecatedRequestPackage)
    );
  });

  it('should return correct data for "recently-published request --json', async () => {
    const {stdout} = await execa('tsx', ['./src/index.ts', 'request', '--json']);
    const result = JSON.parse(stdout);
    expect(extractVersionAndPublishDate(result)).toEqual(
      extractVersionAndPublishDate(mockDataForDeprecatedRequestPackage.slice(0, 5))
    );
  });

  it('should return correct data for "recently-published request --display=1', async () => {
    const {stdout} = await execa('tsx', ['./src/index.ts', 'request', '--display=1', '--json']);
    const result = JSON.parse(stdout);
    expect(extractVersionAndPublishDate(result)).toEqual(
      extractVersionAndPublishDate(mockDataForDeprecatedRequestPackage.slice(0, 1))
    );
  });
});

const mockDataForDeprecatedRequestPackage = [
  {
    version: '2.88.2',
    publishDate: '2020-02-11T16:35:36.122Z',
    relativePublishDate: '4 years ago',
    formattedPublishDate: 'Tue Feb 11 2020 11:35 AM'
  },
  {
    version: '2.88.0',
    publishDate: '2018-08-10T16:26:50.936Z',
    relativePublishDate: '6 years ago',
    formattedPublishDate: 'Fri Aug 10 2018 12:26 PM'
  },
  {
    version: '2.87.0',
    publishDate: '2018-05-21T07:35:02.834Z',
    relativePublishDate: '6 years ago',
    formattedPublishDate: 'Mon May 21 2018 3:35 AM'
  },
  {
    version: '2.86.0',
    publishDate: '2018-05-15T12:06:18.253Z',
    relativePublishDate: '6 years ago',
    formattedPublishDate: 'Tue May 15 2018 8:06 AM'
  },
  {
    version: '2.85.0',
    publishDate: '2018-03-12T10:37:49.925Z',
    relativePublishDate: '6 years ago',
    formattedPublishDate: 'Mon Mar 12 2018 6:37 AM'
  },
  {
    version: '2.84.0',
    publishDate: '2018-03-12T08:40:34.279Z',
    relativePublishDate: '6 years ago',
    formattedPublishDate: 'Mon Mar 12 2018 4:40 AM'
  },
  {
    version: '2.83.0',
    publishDate: '2017-09-27T03:00:36.500Z',
    relativePublishDate: '6 years ago',
    formattedPublishDate: 'Tue Sep 26 2017 11:00 PM'
  },
  {
    version: '2.82.0',
    publishDate: '2017-09-19T19:39:30.271Z',
    relativePublishDate: '6 years ago',
    formattedPublishDate: 'Tue Sep 19 2017 3:39 PM'
  },
  {
    version: '2.81.0',
    publishDate: '2017-03-09T15:56:47.595Z',
    relativePublishDate: '7 years ago',
    formattedPublishDate: 'Thu Mar 9 2017 10:56 AM'
  },
  {
    version: '2.80.0',
    publishDate: '2017-03-04T04:42:42.782Z',
    relativePublishDate: '7 years ago',
    formattedPublishDate: 'Fri Mar 3 2017 11:42 PM'
  },
  {
    version: '2.79.0',
    publishDate: '2016-11-18T17:21:08.710Z',
    relativePublishDate: '7 years ago',
    formattedPublishDate: 'Fri Nov 18 2016 12:21 PM'
  },
  {
    version: '2.78.0',
    publishDate: '2016-11-03T13:38:05.614Z',
    relativePublishDate: '7 years ago',
    formattedPublishDate: 'Thu Nov 3 2016 9:38 AM'
  },
  {
    version: '2.77.0',
    publishDate: '2016-11-03T11:17:58.147Z',
    relativePublishDate: '7 years ago',
    formattedPublishDate: 'Thu Nov 3 2016 7:17 AM'
  },
  {
    version: '2.76.0',
    publishDate: '2016-10-25T08:57:56.992Z',
    relativePublishDate: '7 years ago',
    formattedPublishDate: 'Tue Oct 25 2016 4:57 AM'
  },
  {
    version: '2.75.0',
    publishDate: '2016-09-17T22:33:28.885Z',
    relativePublishDate: '7 years ago',
    formattedPublishDate: 'Sat Sep 17 2016 6:33 PM'
  },
  {
    version: '2.74.0',
    publishDate: '2016-07-22T23:44:44.438Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Fri Jul 22 2016 7:44 PM'
  },
  {
    version: '2.73.0',
    publishDate: '2016-07-09T07:43:25.258Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Sat Jul 9 2016 3:43 AM'
  },
  {
    version: '2.72.0',
    publishDate: '2016-04-17T13:53:37.912Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Sun Apr 17 2016 9:53 AM'
  },
  {
    version: '2.71.0',
    publishDate: '2016-04-12T13:09:36.572Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Tue Apr 12 2016 9:09 AM'
  },
  {
    version: '2.70.0',
    publishDate: '2016-04-05T10:07:28.642Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Tue Apr 5 2016 6:07 AM'
  },
  {
    version: '2.69.0',
    publishDate: '2016-01-27T19:00:03.126Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Wed Jan 27 2016 2:00 PM'
  },
  {
    version: '2.68.0',
    publishDate: '2016-01-27T16:20:27.766Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Wed Jan 27 2016 11:20 AM'
  },
  {
    version: '2.67.0',
    publishDate: '2015-11-19T07:45:48.220Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Thu Nov 19 2015 2:45 AM'
  },
  {
    version: '2.66.0',
    publishDate: '2015-11-18T10:07:33.695Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Wed Nov 18 2015 5:07 AM'
  },
  {
    version: '2.65.0',
    publishDate: '2015-10-11T18:04:53.725Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Sun Oct 11 2015 2:04 PM'
  },
  {
    version: '2.64.0',
    publishDate: '2015-09-25T12:21:27.306Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Fri Sep 25 2015 8:21 AM'
  },
  {
    version: '2.63.0',
    publishDate: '2015-09-21T14:00:39.341Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Mon Sep 21 2015 10:00 AM'
  },
  {
    version: '2.62.0',
    publishDate: '2015-09-15T08:23:47.863Z',
    relativePublishDate: '8 years ago',
    formattedPublishDate: 'Tue Sep 15 2015 4:23 AM'
  },
  {
    version: '2.61.0',
    publishDate: '2015-08-19T15:39:45.178Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Wed Aug 19 2015 11:39 AM'
  },
  {
    version: '2.60.0',
    publishDate: '2015-07-21T12:29:31.604Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Tue Jul 21 2015 8:29 AM'
  },
  {
    version: '2.59.0',
    publishDate: '2015-07-20T08:49:43.418Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Mon Jul 20 2015 4:49 AM'
  },
  {
    version: '2.58.0',
    publishDate: '2015-06-16T11:28:02.894Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Tue Jun 16 2015 7:28 AM'
  },
  {
    version: '2.57.0',
    publishDate: '2015-05-31T19:04:35.520Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Sun May 31 2015 3:04 PM'
  },
  {
    version: '2.56.0',
    publishDate: '2015-05-28T18:03:06.887Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Thu May 28 2015 2:03 PM'
  },
  {
    version: '2.55.0',
    publishDate: '2015-04-05T04:24:35.395Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Sun Apr 5 2015 12:24 AM'
  },
  {
    version: '2.54.0',
    publishDate: '2015-03-24T22:01:04.401Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Tue Mar 24 2015 6:01 PM'
  },
  {
    version: '2.53.0',
    publishDate: '2015-02-02T16:09:19.191Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Mon Feb 2 2015 11:09 AM'
  },
  {
    version: '2.52.0',
    publishDate: '2015-02-02T00:58:58.406Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Sun Feb 1 2015 7:58 PM'
  },
  {
    version: '2.51.0',
    publishDate: '2014-12-10T15:08:10.339Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Wed Dec 10 2014 10:08 AM'
  },
  {
    version: '2.50.0',
    publishDate: '2014-12-09T15:36:36.588Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Tue Dec 9 2014 10:36 AM'
  },
  {
    version: '2.49.0',
    publishDate: '2014-11-28T18:12:39.597Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Fri Nov 28 2014 1:12 PM'
  },
  {
    version: '2.48.0',
    publishDate: '2014-11-12T17:08:56.247Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Wed Nov 12 2014 12:08 PM'
  },
  {
    version: '2.47.0',
    publishDate: '2014-10-26T23:52:13.024Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Sun Oct 26 2014 7:52 PM'
  },
  {
    version: '2.46.0',
    publishDate: '2014-10-23T16:34:08.339Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Thu Oct 23 2014 12:34 PM'
  },
  {
    version: '2.45.0',
    publishDate: '2014-10-06T00:06:02.756Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Sun Oct 5 2014 8:06 PM'
  },
  {
    version: '2.44.0',
    publishDate: '2014-09-18T10:53:09.149Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Thu Sep 18 2014 6:53 AM'
  },
  {
    version: '2.43.0',
    publishDate: '2014-09-18T10:51:34.944Z',
    relativePublishDate: '9 years ago',
    formattedPublishDate: 'Thu Sep 18 2014 6:51 AM'
  },
  {
    version: '2.42.0',
    publishDate: '2014-09-04T22:24:16.945Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Thu Sep 4 2014 6:24 PM'
  },
  {
    version: '2.41.0',
    publishDate: '2014-09-04T20:36:17.279Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Thu Sep 4 2014 4:36 PM'
  },
  {
    version: '2.40.0',
    publishDate: '2014-08-06T18:29:34.302Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Wed Aug 6 2014 2:29 PM'
  },
  {
    version: '2.39.0',
    publishDate: '2014-07-24T02:20:50.881Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Wed Jul 23 2014 10:20 PM'
  },
  {
    version: '2.38.0',
    publishDate: '2014-07-22T13:44:48.332Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Tue Jul 22 2014 9:44 AM'
  },
  {
    version: '2.37.0',
    publishDate: '2014-07-07T17:24:45.290Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Mon Jul 7 2014 1:24 PM'
  },
  {
    version: '2.36.0',
    publishDate: '2014-05-19T20:58:14.683Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Mon May 19 2014 4:58 PM'
  },
  {
    version: '2.35.0',
    publishDate: '2014-05-17T20:56:43.641Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Sat May 17 2014 4:56 PM'
  },
  {
    version: '2.34.0',
    publishDate: '2014-02-18T19:35:27.908Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Tue Feb 18 2014 2:35 PM'
  },
  {
    version: '2.33.0',
    publishDate: '2014-01-16T19:48:02.613Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Thu Jan 16 2014 2:48 PM'
  },
  {
    version: '2.32.0',
    publishDate: '2014-01-16T19:33:18.069Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Thu Jan 16 2014 2:33 PM'
  },
  {
    version: '2.31.0',
    publishDate: '2014-01-08T02:57:12.510Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Tue Jan 7 2014 9:57 PM'
  },
  {
    version: '2.30.0',
    publishDate: '2013-12-13T19:17:56.851Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Fri Dec 13 2013 2:17 PM'
  },
  {
    version: '2.29.0',
    publishDate: '2013-12-06T20:05:35.433Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Fri Dec 6 2013 3:05 PM'
  },
  {
    version: '2.28.0',
    publishDate: '2013-12-04T19:42:46.371Z',
    relativePublishDate: '10 years ago',
    formattedPublishDate: 'Wed Dec 4 2013 2:42 PM'
  },
  {
    version: '2.27.0',
    publishDate: '2013-08-15T21:30:34.410Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Thu Aug 15 2013 5:30 PM'
  },
  {
    version: '2.26.0',
    publishDate: '2013-08-07T16:31:07.773Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Wed Aug 7 2013 12:31 PM'
  },
  {
    version: '2.25.0',
    publishDate: '2013-07-23T21:51:30.696Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Tue Jul 23 2013 5:51 PM'
  },
  {
    version: '2.24.0',
    publishDate: '2013-07-23T20:51:33.068Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Tue Jul 23 2013 4:51 PM'
  },
  {
    version: '2.23.0',
    publishDate: '2013-07-23T02:45:03.153Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Jul 22 2013 10:45 PM'
  },
  {
    version: '2.22.0',
    publishDate: '2013-07-05T17:12:48.170Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Fri Jul 5 2013 1:12 PM'
  },
  {
    version: '2.21.0',
    publishDate: '2013-04-30T21:28:44.759Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Tue Apr 30 2013 5:28 PM'
  },
  {
    version: '2.20.0',
    publishDate: '2013-04-22T21:49:15.616Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Apr 22 2013 5:49 PM'
  },
  {
    version: '2.19.0',
    publishDate: '2013-04-22T16:48:30.477Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Apr 22 2013 12:48 PM'
  },
  {
    version: '2.18.0',
    publishDate: '2013-04-22T15:53:37.983Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Apr 22 2013 11:53 AM'
  },
  {
    version: '2.16.6',
    publishDate: '2013-03-18T22:48:42.025Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Mar 18 2013 6:48 PM'
  },
  {
    version: '2.16.4',
    publishDate: '2013-03-18T19:16:10.266Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Mar 18 2013 3:16 PM'
  },
  {
    version: '2.16.2',
    publishDate: '2013-03-13T20:46:28.455Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Wed Mar 13 2013 4:46 PM'
  },
  {
    version: '2.16.0',
    publishDate: '2013-03-13T17:48:37.937Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Wed Mar 13 2013 1:48 PM'
  },
  {
    version: '2.14.0',
    publishDate: '2013-02-19T23:53:42.323Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Tue Feb 19 2013 6:53 PM'
  },
  {
    version: '2.12.0',
    publishDate: '2012-11-09T21:49:57.215Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Fri Nov 9 2012 4:49 PM'
  },
  {
    version: '2.11.4',
    publishDate: '2012-09-17T19:34:20.945Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Sep 17 2012 3:34 PM'
  },
  {
    version: '2.11.3',
    publishDate: '2012-09-17T19:20:14.479Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Sep 17 2012 3:20 PM'
  },
  {
    version: '2.11.2',
    publishDate: '2012-09-17T19:19:33.839Z',
    relativePublishDate: '11 years ago',
    formattedPublishDate: 'Mon Sep 17 2012 3:19 PM'
  },
  {
    version: '2.11.1',
    publishDate: '2012-09-04T15:20:46.781Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Tue Sep 4 2012 11:20 AM'
  },
  {
    version: '2.11.0',
    publishDate: '2012-08-29T19:18:28.340Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Wed Aug 29 2012 3:18 PM'
  },
  {
    version: '2.10.0',
    publishDate: '2012-08-01T20:56:37.322Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Wed Aug 1 2012 4:56 PM'
  },
  {
    version: '2.9.203',
    publishDate: '2012-06-28T19:58:58.857Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Thu Jun 28 2012 3:58 PM'
  },
  {
    version: '2.9.202',
    publishDate: '2012-04-14T01:48:20.232Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Fri Apr 13 2012 9:48 PM'
  },
  {
    version: '2.9.201',
    publishDate: '2012-04-12T17:44:37.172Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Thu Apr 12 2012 1:44 PM'
  },
  {
    version: '2.9.200',
    publishDate: '2012-04-08T00:41:38.386Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Sat Apr 7 2012 8:41 PM'
  },
  {
    version: '2.9.153',
    publishDate: '2012-03-01T23:43:34.140Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Thu Mar 1 2012 6:43 PM'
  },
  {
    version: '2.9.152',
    publishDate: '2012-02-25T20:55:24.387Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Sat Feb 25 2012 3:55 PM'
  },
  {
    version: '2.9.151',
    publishDate: '2012-02-24T23:08:55.848Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Fri Feb 24 2012 6:08 PM'
  },
  {
    version: '2.9.150',
    publishDate: '2012-02-24T17:53:29.835Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Fri Feb 24 2012 12:53 PM'
  },
  {
    version: '2.9.100',
    publishDate: '2012-01-20T21:25:15.722Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Fri Jan 20 2012 4:25 PM'
  },
  {
    version: '2.9.3',
    publishDate: '2011-12-28T01:49:19.797Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Tue Dec 27 2011 8:49 PM'
  },
  {
    version: '2.9.2',
    publishDate: '2011-12-28T01:04:02.634Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Tue Dec 27 2011 8:04 PM'
  },
  {
    version: '2.9.1',
    publishDate: '2011-12-28T01:02:20.539Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Tue Dec 27 2011 8:02 PM'
  },
  {
    version: '2.9.0',
    publishDate: '2011-12-28T00:47:33.584Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Tue Dec 27 2011 7:47 PM'
  },
  {
    version: '2.2.9',
    publishDate: '2011-12-01T08:39:41.637Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Thu Dec 1 2011 3:39 AM'
  },
  {
    version: '2.2.6',
    publishDate: '2011-12-01T07:38:36.311Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Thu Dec 1 2011 2:38 AM'
  },
  {
    version: '2.2.5',
    publishDate: '2011-11-17T06:35:04.405Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Thu Nov 17 2011 1:35 AM'
  },
  {
    version: '2.2.0',
    publishDate: '2011-11-06T01:40:00.212Z',
    relativePublishDate: '12 years ago',
    formattedPublishDate: 'Sat Nov 5 2011 9:40 PM'
  },
  {
    version: '2.1.1',
    publishDate: '2011-08-23T03:59:30.206Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Mon Aug 22 2011 11:59 PM'
  },
  {
    version: '2.1.0',
    publishDate: '2011-08-15T04:03:17.126Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Mon Aug 15 2011 12:03 AM'
  },
  {
    version: '2.0.5',
    publishDate: '2011-08-13T21:46:39.966Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Sat Aug 13 2011 5:46 PM'
  },
  {
    version: '2.0.4',
    publishDate: '2011-08-13T21:28:21.109Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Sat Aug 13 2011 5:28 PM'
  },
  {
    version: '2.0.3',
    publishDate: '2011-08-12T23:16:25.100Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Fri Aug 12 2011 7:16 PM'
  },
  {
    version: '2.0.2',
    publishDate: '2011-07-29T20:48:36.410Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Fri Jul 29 2011 4:48 PM'
  },
  {
    version: '2.0.1',
    publishDate: '2011-07-21T22:22:13.282Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Thu Jul 21 2011 6:22 PM'
  },
  {
    version: '2.0.0',
    publishDate: '2011-07-21T21:10:38.897Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Thu Jul 21 2011 5:10 PM'
  },
  {
    version: '1.9.9',
    publishDate: '2011-07-21T02:03:21.081Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Wed Jul 20 2011 10:03 PM'
  },
  {
    version: '1.9.8',
    publishDate: '2011-06-23T21:15:20.971Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Thu Jun 23 2011 5:15 PM'
  },
  {
    version: '1.9.7',
    publishDate: '2011-06-23T17:36:13.839Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Thu Jun 23 2011 1:36 PM'
  },
  {
    version: '1.9.5',
    publishDate: '2011-03-27T22:30:25.139Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Sun Mar 27 2011 6:30 PM'
  },
  {
    version: '1.9.3',
    publishDate: '2011-03-22T18:32:57.223Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Tue Mar 22 2011 2:32 PM'
  },
  {
    version: '1.9.2',
    publishDate: '2011-03-22T18:29:21.464Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Tue Mar 22 2011 2:29 PM'
  },
  {
    version: '1.9.1',
    publishDate: '2011-03-22T18:07:16.344Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Tue Mar 22 2011 2:07 PM'
  },
  {
    version: '1.9.0',
    publishDate: '2011-02-11T00:10:06.903Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Thu Feb 10 2011 7:10 PM'
  },
  {
    version: '1.2.0',
    publishDate: '2011-01-30T22:05:41.553Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Sun Jan 30 2011 5:05 PM'
  },
  {
    version: '1.1.1',
    publishDate: '2011-01-23T01:38:57.823Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Sat Jan 22 2011 8:38 PM'
  },
  {
    version: '1.1.0',
    publishDate: '2011-01-23T01:14:46.626Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Sat Jan 22 2011 8:14 PM'
  },
  {
    version: '0.9.0',
    publishDate: '2011-01-22T00:36:12.640Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Fri Jan 21 2011 7:36 PM'
  },
  {
    version: '0.10.0',
    publishDate: '2011-01-22T00:36:12.640Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Fri Jan 21 2011 7:36 PM'
  },
  {
    version: '0.9.1',
    publishDate: '2011-01-22T00:36:12.640Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Fri Jan 21 2011 7:36 PM'
  },
  {
    version: '0.8.3',
    publishDate: '2011-01-22T00:36:12.640Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Fri Jan 21 2011 7:36 PM'
  },
  {
    version: '1.0.0',
    publishDate: '2011-01-22T00:36:12.640Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Fri Jan 21 2011 7:36 PM'
  },
  {
    version: '0.9.5',
    publishDate: '2011-01-22T00:36:12.640Z',
    relativePublishDate: '13 years ago',
    formattedPublishDate: 'Fri Jan 21 2011 7:36 PM'
  }
];
