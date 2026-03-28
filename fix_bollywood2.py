import pathlib

f = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentSection.jsx')
c = f.read_text(encoding='utf-8')

old = """        <ContentRow
          title={type === 'movies' ? 'Top Rated Movies' : 'Top Rated Series'}
          icon={Icon}
          items={topRated}
          onSelectContent={onSelectContent}
          loading={loading}
        />
      </div>
    </section>"""

new = """        <ContentRow
          title={type === 'movies' ? 'Top Rated Movies' : 'Top Rated Series'}
          icon={Icon}
          items={topRated}
          onSelectContent={onSelectContent}
          loading={loading}
        />
        {type === 'movies' && bollywood.length > 0 && (
          <ContentRow
            title="🎬 Bollywood Trending"
            icon={Film}
            items={bollywood}
            onSelectContent={onSelectContent}
            loading={loading}
          />
        )}
        {type === 'movies' && hindiSeries.length > 0 && (
          <ContentRow
            title="📺 Hindi Series"
            icon={Tv}
            items={hindiSeries}
            onSelectContent={onSelectContent}
            loading={loading}
          />
        )}
      </div>
    </section>"""

if old in c:
    c = c.replace(old, new)
    f.write_text(c, encoding='utf-8')
    print('SUCCESS!')
else:
    print('NOT FOUND')
