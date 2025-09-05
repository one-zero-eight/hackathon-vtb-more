import unoserver.client


class ConvertingRepository:
    def __init__(self, server: str, port: int):
        self.client = unoserver.client.UnoClient(server, str(port), host_location="remote")

    def any2pdf(self, inpath: str, outpath: str):
        self.client.convert(inpath=inpath, outpath=outpath)
