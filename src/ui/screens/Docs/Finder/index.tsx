import { h, FunctionComponent } from 'preact'
// import { trackAction } from 'app/acts/tracking_acts'
import debounce from 'lodash/debounce'
import db, { PagePreview } from 'db'
import { Submodule } from 'types/submodule'
import { useCallback, useState } from 'preact/hooks'
import { Container, Loading, Search, SearchField } from './style.css'
import { CancelButton } from './CancelButton'
import { NoResults } from './NoResults'
import { Categories } from './Categories'
import { filterPages } from './utils'
import { useQuery } from '@typesaurus/preact'
import { PACKAGE_NAME } from 'common/constants'
import { where } from 'typesaurus'
import { BooksBanner } from 'ui/components/BooksBanner'

const showJSJobs = false // FIXME: Math.random() > 1

const JSJobsBanner = () => <div>JS jobs banner</div>

type FIXME = any

interface Props {
  selectedVersion: string
  selectedDoc: string
  selectedSubmodule: Submodule
}

export const Finder: FunctionComponent<Props> = ({ selectedSubmodule, selectedVersion, selectedDoc }) => {
  const [query, setQuery] = useState('')

  const trackSearch = useCallback(debounce((query: string) => {
    // FIXME:
    // trackAction('Search', { query })
  }, 500), [])

  const [versions, { loading }] = useQuery(db.versions, [
    where('package', '==', PACKAGE_NAME),
    where('version', '==', selectedVersion)
  ])

  if (versions && versions.length === 1) {
    const { pages, categories } = versions[0].data
    const filteredPages = filterPages(pages, query, selectedSubmodule)

    return (
      <Container>
        <Search tag="header">
          <SearchField
            tag="input"
            autoFocus
            type="text"
            name="search"
            placeholder="Search"
            value={query}
            onInput={(e: FIXME) => {
              const query = e.target.value
              trackSearch(query)
              setQuery(query)
            }}
          />
  
          {query.length >= 0 && <CancelButton setQuery={setQuery} />}
        </Search>
  
        {filteredPages.length === 0 ? <NoResults /> : <Categories pages={filteredPages} categories={categories} selectedVersion={selectedVersion} selectedDoc={selectedDoc} />}
  
        {showJSJobs ? <JSJobsBanner /> : <BooksBanner />}
      </Container>
    )
  } else if (loading) {
    return (
      <Container>
        <Loading>
          Loading...
        </Loading>
      </Container>
    )
  } else {
    // FIXME:
    return (
      <Container>
        <Loading>
          Error!
        </Loading>
      </Container>
    )
  }
}