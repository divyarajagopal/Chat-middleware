import { Request, Response } from 'express';
import { getPingResult } from './healthController';

export default [
  {
    path: '/ping',
    method: 'get',
    handler: [
      async (req: Request, res: Response) => {
        const result = await getPingResult();
        res.status(200).send(result);
      }
    ]
  }
];
