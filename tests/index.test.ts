import { app, main } from '../index';

describe('Test index.ts', () => {
   it('Should export app and main functions', () => {
      expect(app).toBeDefined();
      expect(typeof main).toBe('function');
   });

   it('Should successfully call main function', async () => {
      const exitSpy = jest.spyOn(process, 'exit');
      const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await main();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(logSpy).toHaveBeenCalledWith(
         '❌ Hay problemas leyendo las variables de entorno. NO se puede continuar, pare evitar posibles errores.',
      );

      exitSpy.mockRestore();
      logSpy.mockRestore();
   });

   it('Should handle server start error', async () => {
      const listenSpy = jest.spyOn(app, 'listen').mockImplementation(() => {
         throw new Error('Server start error');
      });
      const exitSpy = jest.spyOn(process, 'exit');
      await main();

      expect(listenSpy).toHaveBeenCalledWith(process.env.PORT, expect.any(Function));
      expect(exitSpy).toHaveBeenCalledWith(1);
      listenSpy.mockRestore();
      exitSpy.mockRestore();
   });
});
